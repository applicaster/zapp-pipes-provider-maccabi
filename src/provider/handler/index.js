import {
  commands
} from './commands';

export const handler = nativeBridge => params => {
  const {
    type
  } = params;

  if (!type || ['players', 'news', 'matchBox', 'board'].indexOf(type) == -1) {
    return nativeBridge.throwError('unknown request');
  }

  return commands[type](params)
    .then(nativeBridge.sendResponse)
    .catch(nativeBridge.throwError);
};