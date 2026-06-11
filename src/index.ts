import type { ConfigPlugin } from "@expo/config-plugins";
import { withXcodeProject } from "@expo/config-plugins";

const withBuildSettings: ConfigPlugin<Record<string, string>> = (
  config,
  props,
) => {
  if (props == null) {
    return config;
  }

  return withXcodeProject(config, (config) => {
    const project = config.modResults;
    const configurations = project.pbxXCBuildConfigurationSection();

    for (const key in configurations) {
      const buildConfig = configurations[key];

      if (buildConfig.buildSettings) {
        const { buildSettings } = buildConfig;

        for (const key in props) {
          buildSettings[key] = props[key];
        }
      }
    }

    return config;
  });
};

export default withBuildSettings;
