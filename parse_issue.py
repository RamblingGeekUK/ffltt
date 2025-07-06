import json
import sys
import re

# Read the issue body
with open('issue.json', 'r') as f:
    data = json.load(f)
    body = data['body']

print(f"RAW BODY: {body}")
print("---")

# Extract fields using simple string operations
lines = body.split('\n')
channel_name = ""
youtube_url = ""
fully_forked = ""

i = 0
while i < len(lines):
    line = lines[i].strip()
    
    if line == "### Channel Name":
        i += 1
        # Skip empty lines
        while i < len(lines) and lines[i].strip() == "":
            i += 1
        if i < len(lines) and not lines[i].startswith("###"):
            channel_name = lines[i].strip()
            
    elif line == "### YouTube URL":
        i += 1
        # Skip empty lines
        while i < len(lines) and lines[i].strip() == "":
            i += 1
        if i < len(lines) and not lines[i].startswith("###"):
            youtube_url = lines[i].strip()
            
    elif line == "### Fully Forked?":
        i += 1
        # Skip empty lines
        while i < len(lines) and lines[i].strip() == "":
            i += 1
        if i < len(lines) and not lines[i].startswith("###"):
            fully_forked = lines[i].strip()
    
    i += 1

print(f"CHANNEL_NAME: '{channel_name}'")
print(f"YOUTUBE_URL: '{youtube_url}'")
print(f"FULLY_FORKED: '{fully_forked}'")

# Validate required fields
if not channel_name or not youtube_url:
    print("ERROR: Missing required fields")
    sys.exit(1)

# Extract channel ID from YouTube URL
channel_id = ""
if "channel/" in youtube_url:
    match = re.search(r'channel/([^/?]+)', youtube_url)
    if match:
        channel_id = match.group(1)
elif "@" in youtube_url:
    match = re.search(r'@([^/?]+)', youtube_url)
    if match:
        channel_id = match.group(1)

print(f"CHANNEL_ID: '{channel_id}'")

if not channel_id:
    print(f"ERROR: Could not extract channel ID from URL: {youtube_url}")
    sys.exit(1)

# Normalize fully_forked value
fully_forked_bool = fully_forked.lower() == "true"

# Create new entry
new_entry = {
    "name": channel_name,
    "channelId": channel_id,
    "FullyForked": fully_forked_bool
}

print(f"NEW_ENTRY: {json.dumps(new_entry, indent=2)}")

# Save to file
with open('new_entry.json', 'w') as f:
    json.dump(new_entry, f, indent=2)

print("Successfully created new_entry.json")
