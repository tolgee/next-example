import { tolgee } from './tolgee';

describe('tolgee', () => {
  describe('initialization', () => {
    it('should be initialized', () => {
      expect(tolgee).toBeDefined();
    });

    it('should have getLanguage method', () => {
      expect(typeof tolgee.getLanguage).toBe('function');
    });

    it('should have isLoading method', () => {
      expect(typeof tolgee.isLoading).toBe('function');
    });

    it('should have t (translate) method', () => {
      expect(typeof tolgee.t).toBe('function');
    });

    it('should have addStaticData method', () => {
      expect(typeof tolgee.addStaticData).toBe('function');
    });

    it('should have loadRecord method', () => {
      expect(typeof tolgee.loadRecord).toBe('function');
    });
  });

  describe('language loading', () => {
    it('should load English translations', async () => {
      const enData = await import('../messages/en.json');
      expect(enData).toBeDefined();
    });

    it('should load Czech translations', async () => {
      const csData = await import('../messages/cs.json');
      expect(csData).toBeDefined();
    });

    it('should load German translations', async () => {
      const deData = await import('../messages/de.json');
      expect(deData).toBeDefined();
    });

    it('should load French translations', async () => {
      const frData = await import('../messages/fr.json');
      expect(frData).toBeDefined();
    });
  });

  describe('namespaced language loading', () => {
    it('should load namespaced English translations', async () => {
      const enData = await import('../messages/namespaced/en.json');
      expect(enData).toBeDefined();
    });

    it('should load namespaced Czech translations', async () => {
      const csData = await import('../messages/namespaced/cs.json');
      expect(csData).toBeDefined();
    });

    it('should load namespaced German translations', async () => {
      const deData = await import('../messages/namespaced/de.json');
      expect(deData).toBeDefined();
    });

    it('should load namespaced French translations', async () => {
      const frData = await import('../messages/namespaced/fr.json');
      expect(frData).toBeDefined();
    });
  });
});
