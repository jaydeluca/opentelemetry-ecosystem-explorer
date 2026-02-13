"""Tests for instrumentation transformer."""

import pytest
from explorer_db_builder.instrumentation_transformer import (
    _transform_0_1_to_0_2,
    transform_instrumentation_format,
)


class TestTransformInstrumentationFormat:
    def test_format_0_2_no_transformation(self):
        """Format 0.2 data is returned unchanged."""
        data = {
            "file_format": 0.2,
            "libraries": [
                {
                    "name": "test-lib",
                    "javaagent_target_versions": ["com.test:lib:[1.0,)"],
                    "has_standalone_library": True,
                }
            ],
        }

        result = transform_instrumentation_format(data)

        assert result == data
        assert result["file_format"] == 0.2
        assert result["libraries"][0]["javaagent_target_versions"] == ["com.test:lib:[1.0,)"]
        assert result["libraries"][0]["has_standalone_library"] is True

    def test_format_0_1_transforms_to_0_2(self):
        """Format 0.1 data is transformed to 0.2."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "test-lib",
                    "target_versions": {
                        "javaagent": ["com.test:lib:[1.0,)"],
                        "library": ["com.test:lib:1.0.0"],
                    },
                }
            ],
        }

        result = transform_instrumentation_format(data)

        assert result["file_format"] == 0.2
        assert result["libraries"][0]["javaagent_target_versions"] == ["com.test:lib:[1.0,)"]
        assert result["libraries"][0]["has_standalone_library"] is True
        assert "target_versions" not in result["libraries"][0]

    def test_missing_file_format_raises_error(self):
        """Missing file_format field raises ValueError."""
        data = {"libraries": [{"name": "test-lib"}]}

        with pytest.raises(ValueError, match="missing 'file_format' field"):
            transform_instrumentation_format(data)

    def test_unsupported_file_format_raises_error(self):
        """Unsupported file format raises ValueError."""
        data = {"file_format": 0.3, "libraries": []}

        with pytest.raises(ValueError, match="Unsupported file format: 0.3"):
            transform_instrumentation_format(data)

    def test_missing_libraries_raises_error(self):
        """Missing libraries key raises KeyError."""
        data = {"file_format": 0.1}

        with pytest.raises(KeyError, match="missing 'libraries' key"):
            transform_instrumentation_format(data)


class TestTransform01To02:
    def test_transforms_javaagent_target_versions(self):
        """Transforms target_versions.javaagent to javaagent_target_versions."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "akka-http",
                    "target_versions": {
                        "javaagent": ["com.typesafe.akka:akka-http_2.13:[10.1,)"],
                    },
                }
            ],
        }

        result = _transform_0_1_to_0_2(data)

        assert result["file_format"] == 0.2
        assert result["libraries"][0]["javaagent_target_versions"] == ["com.typesafe.akka:akka-http_2.13:[10.1,)"]
        assert "target_versions" not in result["libraries"][0]

    def test_sets_has_standalone_library_true_when_library_present(self):
        """Sets has_standalone_library to true when library versions exist."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "alibaba-druid",
                    "target_versions": {
                        "javaagent": ["com.alibaba:druid:(,)"],
                        "library": ["com.alibaba:druid:1.0.0"],
                    },
                }
            ],
        }

        result = _transform_0_1_to_0_2(data)

        assert result["libraries"][0]["has_standalone_library"] is True

    def test_sets_has_standalone_library_false_when_library_absent(self):
        """Sets has_standalone_library to false when library versions absent."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "test-lib",
                    "target_versions": {
                        "javaagent": ["com.test:lib:[1.0,)"],
                    },
                }
            ],
        }

        result = _transform_0_1_to_0_2(data)

        assert result["libraries"][0]["has_standalone_library"] is False

    def test_sets_has_standalone_library_false_when_library_empty(self):
        """Sets has_standalone_library to false when library list is empty."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "test-lib",
                    "target_versions": {
                        "javaagent": ["com.test:lib:[1.0,)"],
                        "library": [],
                    },
                }
            ],
        }

        result = _transform_0_1_to_0_2(data)

        assert result["libraries"][0]["has_standalone_library"] is False

    def test_handles_library_without_target_versions(self):
        """Handles libraries without target_versions field."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "test-lib",
                    "description": "Test library",
                }
            ],
        }

        result = _transform_0_1_to_0_2(data)

        assert result["file_format"] == 0.2
        assert result["libraries"][0]["name"] == "test-lib"
        assert "target_versions" not in result["libraries"][0]
        assert "javaagent_target_versions" not in result["libraries"][0]

    def test_preserves_other_fields(self):
        """Preserves other library fields during transformation."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "test-lib",
                    "display_name": "Test Library",
                    "description": "A test library",
                    "library_link": "https://example.com",
                    "source_path": "instrumentation/test-lib",
                    "target_versions": {
                        "javaagent": ["com.test:lib:[1.0,)"],
                    },
                    "configurations": [{"name": "test.config", "type": "boolean"}],
                }
            ],
        }

        result = _transform_0_1_to_0_2(data)

        lib = result["libraries"][0]
        assert lib["name"] == "test-lib"
        assert lib["display_name"] == "Test Library"
        assert lib["description"] == "A test library"
        assert lib["library_link"] == "https://example.com"
        assert lib["source_path"] == "instrumentation/test-lib"
        assert lib["configurations"] == [{"name": "test.config", "type": "boolean"}]

    def test_transforms_multiple_libraries(self):
        """Transforms multiple libraries correctly."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "lib1",
                    "target_versions": {
                        "javaagent": ["com.lib1:lib1:[1.0,)"],
                        "library": ["com.lib1:lib1:1.0.0"],
                    },
                },
                {
                    "name": "lib2",
                    "target_versions": {
                        "javaagent": ["com.lib2:lib2:[2.0,)"],
                    },
                },
                {
                    "name": "lib3",
                    "target_versions": {
                        "javaagent": ["com.lib3:lib3:[3.0,)"],
                        "library": ["com.lib3:lib3:3.0.0"],
                    },
                },
            ],
        }

        result = _transform_0_1_to_0_2(data)

        assert len(result["libraries"]) == 3
        assert result["libraries"][0]["has_standalone_library"] is True
        assert result["libraries"][1]["has_standalone_library"] is False
        assert result["libraries"][2]["has_standalone_library"] is True

    def test_missing_libraries_key_raises_error(self):
        """Missing libraries key raises KeyError."""
        data = {"file_format": 0.1}

        with pytest.raises(KeyError, match="missing 'libraries' key"):
            _transform_0_1_to_0_2(data)

    def test_handles_empty_libraries_list(self):
        """Handles empty libraries list."""
        data = {"file_format": 0.1, "libraries": []}

        result = _transform_0_1_to_0_2(data)

        assert result["file_format"] == 0.2
        assert result["libraries"] == []

    def test_transformation_creates_new_dict(self):
        """Transformation creates new dict and doesn't modify original."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "test-lib",
                    "target_versions": {
                        "javaagent": ["com.test:lib:[1.0,)"],
                    },
                }
            ],
        }

        original_format = data["file_format"]
        original_lib = data["libraries"][0].copy()

        result = _transform_0_1_to_0_2(data)

        # Original data should be unchanged
        assert data["file_format"] == original_format
        assert "target_versions" in data["libraries"][0]
        assert data["libraries"][0]["name"] == original_lib["name"]

        # Result should be transformed
        assert result["file_format"] == 0.2
        assert "target_versions" not in result["libraries"][0]
        assert "javaagent_target_versions" in result["libraries"][0]


class TestRealWorldData:
    def test_transforms_activej_http(self):
        """Transforms real ActiveJ HTTP instrumentation data."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "activej-http-6.0",
                    "display_name": "ActiveJ",
                    "description": "This instrumentation enables HTTP server spans",
                    "library_link": "https://activej.io/",
                    "source_path": "instrumentation/activej-http-6.0",
                    "target_versions": {
                        "javaagent": ["io.activej:activej-http:[6.0,)"],
                    },
                }
            ],
        }

        result = _transform_0_1_to_0_2(data)

        assert result["file_format"] == 0.2
        lib = result["libraries"][0]
        assert lib["javaagent_target_versions"] == ["io.activej:activej-http:[6.0,)"]
        assert lib["has_standalone_library"] is False
        assert "target_versions" not in lib

    def test_transforms_alibaba_druid(self):
        """Transforms real Alibaba Druid instrumentation data."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "alibaba-druid-1.0",
                    "description": "The Alibaba Druid instrumentation",
                    "library_link": "https://github.com/alibaba/druid",
                    "source_path": "instrumentation/alibaba-druid-1.0",
                    "target_versions": {
                        "javaagent": ["com.alibaba:druid:(,)"],
                        "library": ["com.alibaba:druid:1.0.0"],
                    },
                }
            ],
        }

        result = _transform_0_1_to_0_2(data)

        assert result["file_format"] == 0.2
        lib = result["libraries"][0]
        assert lib["javaagent_target_versions"] == ["com.alibaba:druid:(,)"]
        assert lib["has_standalone_library"] is True
        assert "target_versions" not in lib

    def test_transforms_akka_actor(self):
        """Transforms real Akka Actor instrumentation data."""
        data = {
            "file_format": 0.1,
            "libraries": [
                {
                    "name": "akka-actor-2.3",
                    "display_name": "Akka Actors",
                    "description": "This instrumentation provides context propagation",
                    "library_link": "https://doc.akka.io/",
                    "source_path": "instrumentation/akka/akka-actor-2.3",
                    "target_versions": {
                        "javaagent": [
                            "com.typesafe.akka:akka-actor_2.11:[2.3,)",
                            "com.typesafe.akka:akka-actor_2.12:[2.3,)",
                            "com.typesafe.akka:akka-actor_2.13:[2.3,)",
                        ],
                    },
                }
            ],
        }

        result = _transform_0_1_to_0_2(data)

        assert result["file_format"] == 0.2
        lib = result["libraries"][0]
        assert len(lib["javaagent_target_versions"]) == 3
        assert lib["has_standalone_library"] is False
        assert "target_versions" not in lib
