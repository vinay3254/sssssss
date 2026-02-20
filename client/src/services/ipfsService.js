const API_BASE_URL = 'http://localhost:3000/api';

class IPFSService {
  async savePresentation(presentationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ipfs/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(presentationData)
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('IPFS save failed:', error);
      throw error;
    }
  }

  async loadPresentation(ipfsHash) {
    try {
      const response = await fetch(`${API_BASE_URL}/ipfs/load/${ipfsHash}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('IPFS load failed:', error);
      throw error;
    }
  }
}

export default new IPFSService();