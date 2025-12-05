
import os
import re

def remove_comments(content):
    # Regex to match strings or comments
    pattern = r'("(\\.|[^"\\])*"|\'(\\.|[^\'\\])*\'|`(\\.|[^`\\])*`)|(\/\/[^\r\n]*)|(\/\*[\s\S]*?\*\/)'
    
    def replacer(match):
        # If it's a string (group 1), return it as is
        if match.group(1):
            return match.group(1)
        # Otherwise it's a comment, return empty string
        return ""
    
    return re.sub(pattern, replacer, content)

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = remove_comments(content)
                    
                    # Basic cleanup of empty lines left by full-line comments
                    # new_content = re.sub(r'^\s*$\n', '', new_content, flags=re.MULTILINE)

                    if content != new_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Cleaned: {file}")
                except Exception as e:
                    print(f"Error processing {file}: {e}")

if __name__ == "__main__":
    print("Starting comment removal...")
    process_directory("src")
    print("Comment removal complete.")
