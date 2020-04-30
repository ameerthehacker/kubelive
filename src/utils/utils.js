const CXT = 'CXT';

module.exports = {
  getCurrentCXT() {
    return global[CXT];
  },
  setCurrentCXT(name) {
    global[CXT] = name;
  }
};
