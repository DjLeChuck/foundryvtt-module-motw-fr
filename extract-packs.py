import os
from ruamel.yaml import YAML

def extract_nested_keys(data, keys):
    result = {}
    result["original_name"] = data["name"]
    for key in keys:
        parts = key.split('.')
        current = data
        for part in parts:
            if part in current:
                current = current[part]
            else:
                current = ""
                break
        # Ajouter la valeur au résultat seulement si elle n'est pas vide
        if current:
            result[keys[key]] = current
    return result

def extract_keys(input_dir, output_dir, mapping):
    yaml = YAML()
    yaml.default_flow_style = False  # Pour utiliser le style de bloc
    for root, dirs, files in os.walk(input_dir):
        for file in files:
            if file.endswith(".yaml") or file.endswith(".yml"):
                input_path = os.path.join(root, file)
                output_path = os.path.join(output_dir, os.path.relpath(root, input_dir), file)
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                with open(input_path, "r") as f:
                    data = yaml.load(f)
                extracted_data = extract_nested_keys(data, mapping)
                with open(output_path, "w") as f:
                    yaml.dump(extracted_data, f)

input_directory = "_packs/targets"
output_directory = "_packs/extracts"

key_mapping = {
    "name": "name",
    "system.description": "description",
    "system.moveResults.success.value": "success",
    "system.moveResults.partial.value": "partial",
    "system.moveResults.failure.value": "failure",
    "system.choices": "choices",
}

extract_keys(input_directory, output_directory, key_mapping)
