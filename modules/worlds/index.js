(function (global) {
  const { CLOUD_PORT_WORLD } = global.MiuWorldCloudPort;
  const { MIU_SQUARE_WORLD } = global.MiuWorldMiuSquare;
  const { SUNNY_FOREST_WORLD } = global.MiuWorldSunnyForest;

  const WORLD_OPTIONS = [MIU_SQUARE_WORLD, CLOUD_PORT_WORLD, SUNNY_FOREST_WORLD];

  function getWorldById(worldId) {
    return WORLD_OPTIONS.find((world) => world.id === worldId) || MIU_SQUARE_WORLD;
  }

  global.MiuWorlds = {
    WORLD_OPTIONS,
    getWorldById
  };
})(window);
