"""Main entry point for documentation sync automation."""

import argparse
import logging
import sys

from collector_watcher.inventory_manager import InventoryManager

from documentation_sync.doc_content_generator import DocContentGenerator
from documentation_sync.doc_marker_updater import DocMarkerUpdater
from documentation_sync.docs_repository_manager import DocsRepositoryManager
from documentation_sync.update_docs import get_latest_version, merge_inventories

logger = logging.getLogger(__name__)


def configure_logging():
    """Configure logging to output to stdout."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )


def main():
    """Update docs in local opentelemetry.io repository."""
    configure_logging()

    parser = argparse.ArgumentParser(
        description="Update OpenTelemetry documentation with latest collector component data",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--no-update",
        action="store_true",
        help="Skip updating the docs repository (use existing clone)",
    )
    args = parser.parse_args()

    logger.info("=" * 60)
    logger.info("Documentation Sync")
    logger.info("=" * 60)
    logger.info("")

    logger.info("Setting up opentelemetry.io repository...")
    docs_repo_manager = DocsRepositoryManager()
    try:
        docs_repo = docs_repo_manager.setup_repository(update=not args.no_update)
    except RuntimeError as e:
        logger.error(f"❌ {e}")
        sys.exit(1)

    logger.info("Loading inventory...")
    inventory_manager = InventoryManager("ecosystem-registry/collector")

    contrib_version = get_latest_version(inventory_manager, "contrib")
    core_version = get_latest_version(inventory_manager, "core")

    logger.info("Loading core inventory...")
    core_inventory = inventory_manager.load_versioned_inventory("core", core_version)

    logger.info("Loading contrib inventory...")
    contrib_inventory = inventory_manager.load_versioned_inventory("contrib", contrib_version)

    logger.info("Merging inventories...")
    merged_inventory = merge_inventories(core_inventory, contrib_inventory)

    total_components = sum(len(comps) for comps in merged_inventory["components"].values())
    logger.info(f"Loaded {total_components} total components")

    logger.info("\nGenerating component tables...")
    doc_gen = DocContentGenerator()
    tables = doc_gen.generate_all_component_tables(merged_inventory)

    logger.info(f"Generated {len(tables)} component tables")

    updater = DocMarkerUpdater()

    # Update each component type page
    components_dir = docs_repo / "content/en/docs/collector/components"

    if not components_dir.exists():
        logger.error(f"\n❌ Error: {components_dir} does not exist")
        logger.error("Please ensure the opentelemetry.io repository has the collector components directory")
        sys.exit(1)

    logger.info(f"\nUpdating pages in {components_dir}...")
    updated_count = 0

    for table_key, table_content in tables.items():
        # Determine the file and marker for this table
        # table_key can be "receiver", "extension", "extension-encoding", etc.
        # Extension subtypes go in extension.md, everything else uses the table_key as filename
        page_name = "extension" if table_key.startswith("extension-") else table_key
        marker_id = f"{table_key}-table"
        page_path = components_dir / f"{page_name}.md"

        if not page_path.exists():
            logger.info(f"  ⚠️  {page_name}.md not found, skipping")
            continue

        # Update the table section
        success = updater.update_file(page_path, marker_id, table_content)

        if success:
            logger.info(f"  ✓ {page_name}.md ({marker_id})")
            updated_count += 1
        else:
            logger.info(f"  ⚠️  {page_name}.md - marker '{marker_id}' not found")

    if updated_count > 0:
        logger.info(f"\n✅ Done! Updated {updated_count} page(s)")
    else:
        logger.error("\n⚠️  No pages were updated. Make sure the pages have the correct markers:")
        logger.error(
            "  <!-- BEGIN GENERATED: {component-type}-table SOURCE: open-telemetry/opentelemetry-ecosystem-explorer -->"
        )
        logger.error(
            "  <!-- END GENERATED: {component-type}-table SOURCE: open-telemetry/opentelemetry-ecosystem-explorer -->"
        )


if __name__ == "__main__":
    main()
