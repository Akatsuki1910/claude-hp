#!/bin/bash

url="http://localhost:8080/api/commands"

text=$(wget -qO- "$url" | jq -r '.text')
echo "$text"
