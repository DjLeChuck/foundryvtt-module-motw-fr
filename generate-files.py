import os
import yaml
import json

def generate_json(input_dir, output_dir, compendium_labels):
    for root, dirs, files in os.walk(input_dir):
        for directory in dirs:
            label = compendium_labels.get(directory, directory)
            json_data = {
                "label": label,
                "mapping": {
                    "description": "system.description",
                    "success": "system.moveResults.success.value",
                    "partial": "system.moveResults.partial.value",
                    "failure": "system.moveResults.failure.value",
                    "choices": "system.choices",
                    "successLabel": {
                        "path": "system.moveResults.success.label",
                        "converter": "resultLabel"
                    },
                    "partialLabel": {
                        "path": "system.moveResults.partial.label",
                        "converter": "resultLabel"
                    },
                    "failureLabel": {
                        "path": "system.moveResults.failure.label",
                        "converter": "resultLabel"
                    }
                },
                "entries": {}
            }
            directory_path = os.path.join(root, directory)
            json_filename = f"motw-for-pbta.{directory}.json"
            for file in os.listdir(directory_path):
                if file.endswith(".yaml") or file.endswith(".yml"):
                    input_path = os.path.join(directory_path, file)
                    with open(input_path, "r") as f:
                        data = yaml.safe_load(f)
                    entry_name = data.get("original_name", None)
                    if entry_name:
                        entry_data = {}
                        name = data.get("name", None)
                        if name:
                            entry_data["name"] = name
                        description = data.get("description", None)
                        if description:
                            entry_data["description"] = description
                        success = data.get("success", None)
                        if success:
                            entry_data["success"] = success
                        partial = data.get("partial", None)
                        if partial:
                            entry_data["partial"] = partial
                        failure = data.get("failure", None)
                        if failure:
                            entry_data["failure"] = failure
                        choices = data.get("choices", None)
                        if choices:
                            entry_data["choices"] = choices
                        json_data["entries"][entry_name] = entry_data
            output_path = os.path.join(output_dir, json_filename)
            with open(output_path, "w") as f:
                json.dump(json_data, f, indent=2)

input_directory = "_packs/extracts"
output_dir = "compendium/fr"
compendium_labels = {
    "basic-moves": "Manœuvres basiques",
    "other-moves": "Autres manœuvres",
    "playbooks": "Les Livrets",
    "special-moves-tom": "special-moves-tom",
    "tags": "Tags",
    "the-chosen": "L’Élu",
    "the-crooked": "Le Vaurien",
    "the-divine": "Le Divin",
    "the-expert": "L’Expert",
    "the-flake": "Le Parano",
    "the-gumshoe-tom": "the-gumshoe-tom",
    "the-hex-tom": "the-hex-tom",
    "the-initiate": "L’Initié",
    "the-monstrous": "Le Monstre",
    "the-mundane": "L’Ordinaire",
    "the-paromantic-tom": "the-paromantic-tom",
    "the-professional": "Le Professionnel",
    "the-searcher-tom": "the-searcher-tom",
    "the-snoop-he": "the-snoop-he",
    "the-spell-slinger": "Le Magicien",
    "the-spooky": "L’Épouvantail",
    "the-wronged": "Le Vengeur",
    "the-weird-basic-moves-tom": "the-weird-basic-moves-tom",
}

generate_json(input_directory, output_dir, compendium_labels)
