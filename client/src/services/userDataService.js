class UserDataService {
  getUserKey(userId, dataType) {
    return `etherxppt_${userId}_${dataType}`;
  }

  saveToHistory(userId, presentationData) {
    const key = this.getUserKey(userId, 'history');
    const history = this.getHistory(userId);
    
    const newEntry = {
      id: Date.now(),
      name: presentationData.title || 'Untitled Presentation',
      slides: presentationData.slides,
      lastModified: new Date().toISOString()
    };

    const filtered = history.filter(item => item.name !== newEntry.name);
    const updated = [newEntry, ...filtered].slice(0, 50);

    localStorage.setItem(key, JSON.stringify(updated));
    return newEntry;
  }

  getHistory(userId) {
    const key = this.getUserKey(userId, 'history');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  addToFavorites(userId, presentationData) {
    const key = this.getUserKey(userId, 'favorites');
    const favorites = this.getFavorites(userId);
    
    const newFavorite = {
      id: Date.now(),
      name: presentationData.title || 'Untitled Presentation',
      slides: presentationData.slides,
      addedAt: new Date().toISOString()
    };

    if (!favorites.find(fav => fav.name === newFavorite.name)) {
      const updated = [newFavorite, ...favorites];
      localStorage.setItem(key, JSON.stringify(updated));
      return newFavorite;
    }
    return null;
  }

  getFavorites(userId) {
    const key = this.getUserKey(userId, 'favorites');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  removeFromFavorites(userId, presentationId) {
    const key = this.getUserKey(userId, 'favorites');
    const favorites = this.getFavorites(userId);
    const updated = favorites.filter(fav => fav.id !== presentationId);
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  }

  savePresentation(userId, presentationData) {
    const key = this.getUserKey(userId, 'current_presentation');
    localStorage.setItem(key, JSON.stringify(presentationData));
    this.saveToHistory(userId, presentationData);
  }

  loadPresentation(userId) {
    const key = this.getUserKey(userId, 'current_presentation');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  getUserPresentations(userId) {
    return this.getHistory(userId);
  }
}

export default new UserDataService();