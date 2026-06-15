// Source - https://stackoverflow.com/a/78368050
// Posted by Raihan K., modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-15, License - CC BY-SA 4.0

module.exports = {
  apps: [
    {
      cwd: ".",
      name: "tubitak-mock-api",
      script: "./dist/app.js",
      node_args: "-r dotenv/config",
      args: "dotenv_config_path=./.env",
      watch: ["dist"],
      ignore_watch: ["node_modules"],
    },
  ],
};
