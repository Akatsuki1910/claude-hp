#!/bin/sh

# ファイル名
FILE="commands.txt"

# ファイルが存在しない or 空の場合はエラー
if [ ! -s "$FILE" ]; then
  exit 1
fi

# 中身を読み取る
CONTENT=$(cat "$FILE")

# ファイルを空にする
>"$FILE"

# 読み取った内容を出力
echo "$CONTENT"
