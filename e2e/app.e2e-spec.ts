import { Agular4SeedPage } from './app.po';

describe('agular4-seed App', () => {
  let page: Agular4SeedPage;

  beforeEach(() => {
    page = new Agular4SeedPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
