#!/bin/sh

# ファイル名
FILE="commands.txt"

# 中身を読み込んで変数に格納
if [ -f "$FILE" ]; then
  CONTENT=$(cat "$FILE")

  # ファイルの中身を削除
  >"$FILE"

  # 内容を出力
  echo "$CONTENT"
else
  echo "commands.txt が存在しません" >&2
  exit 1
fi
