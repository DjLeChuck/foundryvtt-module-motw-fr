Hooks.on('init', async () => {
  game.settings.register('motw-fr', 'autoRegisterBabel', {
    name: 'Activer automatiquement la traduction via Babele',
    hint: 'Met automatiquement en place les traductions au sein de Babele sans avoir besoin de pointer vers le répertoire contenant les traductions.',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
    requiresReload: true,
    onChange: value => {
      if (value) {
        autoRegisterBabel();
      }
    },
  });

  game.settings.register('motw-fr', 'setBaseCompendiumsFolders', {
    name: 'Ranger les compendiums de base dans des dossiers',
    hint: 'Fais en sorte de mettre les compendiums propulsés par le module de base dans des dossiers afin de faciliter la lecture.',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
    requiresReload: true,
  });

  game.settings.register('motw-fr', 'basePlaybooksFolder', {
    scope: 'world',
    config: false,
    type: String,
  });

  game.settings.register('motw-fr', 'baseMovesFolder', {
    scope: 'world',
    config: false,
    type: String,
  });

  if (game.settings.get('motw-fr', 'autoRegisterBabel')) {
    autoRegisterBabel();
  }

  Babele.get().registerConverters({
    resultLabel: (value) => {
      switch (value) {
        case 'Success!':
          return 'Succès !';
        case 'Partial success':
          return 'Succès partiel';
        case 'Miss...':
          return 'Échec...';
        default:
          return value;
      }
    },
  });
});

Hooks.on('ready', async () => {
  await setCompendiumsFolders();
});

function autoRegisterBabel() {
  if (typeof Babele !== 'undefined') {
    Babele.get().register({
      module: 'motw-fr',
      lang: 'fr',
      dir: 'compendium/fr',
    });
  }
}

async function setCompendiumsFolders() {
  if (game.settings.get('motw-fr', 'setBaseCompendiumsFolders')) {
    await prepareCompendiumsFolders();
  }

  await processPlaybooks();
  await processMoves();

  if (!game.settings.get('motw-fr', 'setBaseCompendiumsFolders')) {
    await cleanupCompendiumsFolders();
  }
}

async function processPlaybooks() {
  let folder = null;

  if (game.settings.get('motw-fr', 'setBaseCompendiumsFolders')) {
    folder = game.folders.get(game.settings.get('motw-fr', 'basePlaybooksFolder'));
    if (!folder) {
      ui.notifications.error('Impossible de trouver le dossier des livrets de base.');

      return;
    }
  }

  const packs = [
    'motw-for-pbta.the-chosen', 'motw-for-pbta.the-crooked', 'motw-for-pbta.the-divine', 'motw-for-pbta.the-expert',
    'motw-for-pbta.the-flake', 'motw-for-pbta.the-initiate', 'motw-for-pbta.the-monstrous', 'motw-for-pbta.the-mundane',
    'motw-for-pbta.the-professional', 'motw-for-pbta.the-spell-slinger', 'motw-for-pbta.the-spooky',
    'motw-for-pbta.the-wronged', 'motw-for-pbta.the-gumshoe-tom', 'motw-for-pbta.the-hex-tom',
    'motw-for-pbta.the-pararomantic-tom', 'motw-for-pbta.the-searcher-tom', 'motw-for-pbta.the-snoop-he',
    'motw-for-pbta.the-spooktacular-he',
  ];

  for (const pack of packs) {
    await game.packs.get(pack)?.setFolder(folder);
  }
}

async function processMoves() {
  let folder = null;

  if (game.settings.get('motw-fr', 'setBaseCompendiumsFolders')) {
    folder = game.folders.get(game.settings.get('motw-fr', 'baseMovesFolder'));
    if (!folder) {
      ui.notifications.error('Impossible de trouver le dossier des manœuvres.');

      return;
    }
  }

  const packs = [
    'motw-for-pbta.basic-moves', 'motw-for-pbta.other-moves',
    'motw-for-pbta.weird-basic-moves-tom', 'motw-for-pbta.special-moves-tom',
  ];

  for (const pack of packs) {
    await game.packs.get(pack)?.setFolder(folder);
  }
}

async function prepareCompendiumsFolders() {
  const basePlaybooks = game.folders.get(game.settings.get('motw-fr', 'basePlaybooksFolder'));
  if (!basePlaybooks) {
    const folders = await Folder.createDocuments([{
      name: 'Livrets - Module de base',
      type: 'Compendium',
      sorting: 'a',
    }]);

    await game.settings.set('motw-fr', 'basePlaybooksFolder', folders[0]._id);
  }

  const baseMoves = game.folders.get(game.settings.get('motw-fr', 'baseMovesFolder'));
  if (!baseMoves) {
    const folders = await Folder.createDocuments([{
      name: 'Manœuvres',
      type: 'Compendium',
      sorting: 'a',
    }]);

    await game.settings.set('motw-fr', 'baseMovesFolder', folders[0]._id);
  }
}

async function cleanupCompendiumsFolders() {
  const basePlaybooks = game.folders.get(game.settings.get('motw-fr', 'basePlaybooksFolder'));
  const baseMoves = game.folders.get(game.settings.get('motw-fr', 'baseMovesFolder'));

  basePlaybooks?.delete();
  baseMoves?.delete();
}
