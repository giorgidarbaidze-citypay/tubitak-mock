// Source - https://stackoverflow.com/a/78368050
// Posted by Raihan K., modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-15, License - CC BY-SA 4.0

module.exports = {
  apps: [
    {
      cwd: ".",
      script: "./dist/app.js",
      watch: ".",
      name: "node-server-prod",
      node_args: "-r dotenv/config",
      args: "dotenv_config_path=./.env",
    },
  ],
};
