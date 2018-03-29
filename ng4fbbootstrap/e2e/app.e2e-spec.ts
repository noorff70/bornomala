import { Ng4fbbootstrapPage } from './app.po';

describe('ng4fbbootstrap App', function() {
  let page: Ng4fbbootstrapPage;

  beforeEach(() => {
    page = new Ng4fbbootstrapPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
