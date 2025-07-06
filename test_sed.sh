#!/bin/bash
# Simpler test for sed commands

# Read the body content
BODY='### Channel Name
Luke Lafreniere
### YouTube URL
https://www.youtube.com/channel/UCC43rlliFy4vFFTVJWao0Hw
### Fully Forked?
false
### Socials (JSON, optional)
_No response_'

echo "Testing sed parsing:"
echo "BODY:"
echo "$BODY"
echo "---"

# Test the sed command for Channel Name
echo "Channel Name test:"
echo "$BODY" | grep -A 10 "^### Channel Name" | sed -n '2,${/^### /q; /^[[:space:]]*$/d; p;}' | head -1

echo "YouTube URL test:"
echo "$BODY" | grep -A 10 "^### YouTube URL" | sed -n '2,${/^### /q; /^[[:space:]]*$/d; p;}' | head -1

echo "Fully Forked test:"
echo "$BODY" | grep -A 10 "^### Fully Forked" | sed -n '2,${/^### /q; /^[[:space:]]*$/d; p;}' | head -1
