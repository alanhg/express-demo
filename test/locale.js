const languagepacksContent = {
  'zh-cn': {
    hash: "7e362a7c22d4de1987d4809ea0dadc08",
    extensions: [
      {
        extensionIdentifier: {
          id: "ms-ceintl.vscode-language-pack-zh-hans",
          uuid: "47e020a1-33db-4cc0-a1b4-42f97781749a",
        },
        "version": "1.71.0"
      },
    ],
    translations: {
      vscode: `/ms-ceintl.vscode-language-pack-zh-hans-1.72.10121008/translations/main.i18n.json`,
    },
    label: "中文(简体)",
  },
}

// NOTE@jsjoeio - code-server should automatically generate the languagepacks.json for
// using different display languages. This is a temporary workaround until we fix that.
await fs.writeFile(path.join(__dirname, "languagepacks.json"), JSON.stringify(languagepacksContent))
