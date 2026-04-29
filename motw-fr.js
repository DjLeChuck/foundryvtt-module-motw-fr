Hooks.once('babele.init', (babele) => {
  babele.register({
    module: 'motw-fr',
    lang: 'fr',
    dir: 'compendium/fr',
  });

  babele.registerConverter('resultLabel', (value) => {
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
  });
});
