type Key = string;
type Version = string;
type MigrationFunction = (oldKey: Key | null) => Key;
interface IMigrationKeys {
    [key: string]: MigrationFunction
}
type Migration = [Version, IMigrationKeys]

export interface IConfig {
    migrations?: Migration[],
    removeAll?: boolean,
    remove?: Key[],
    version: Version
}

const LOCAL_STORAGE_VERSION = 'LOCAL_STORAGE_VERSION';

export default (config: IConfig) => {
    const versionInBrowser = localStorage.getItem(LOCAL_STORAGE_VERSION) || 'DEFAULT';

    if (config.version !== versionInBrowser) {
        if (config.migrations) {
            const currentIndex = config.migrations.map(([version]) => version).indexOf(versionInBrowser);
            const missingMigrations = config.migrations.slice(currentIndex === -1 ? 0 : currentIndex + 1);

            missingMigrations.forEach(([, keys]) => {
                const migrationKeys = Object.keys(keys);
                migrationKeys.forEach(key =>
                    localStorage.setItem(key, keys[key](localStorage.getItem(key))))
            });
        }

        if (config.remove) {
            config.remove.forEach((key: Key) => {
                localStorage.removeItem(key);
            });
        }

        if (config.removeAll) {
            localStorage.clear();
        }

        localStorage.setItem(LOCAL_STORAGE_VERSION, config.version);
    }
}
