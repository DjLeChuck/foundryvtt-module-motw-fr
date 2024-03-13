Hooks.on('init', () => {
  game.settings.register('motw-fr', 'autoRegisterBabel', {
    name: 'Activer automatiquement la traduction via Babele',
    hint: 'Met automatiquement en place les traductions au sein de Babele sans avoir besoin de pointer vers le répertoire contenant les traductions.',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
    onChange: value => {
      if (value) {
        autoRegisterBabel();
      }

      window.location.reload();
    },
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

function autoRegisterBabel() {
  if (typeof Babele !== 'undefined') {
    Babele.get().register({
      module: 'motw-fr',
      lang: 'fr',
      dir: 'compendium/fr',
    });
  }
}
