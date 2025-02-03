import Scanner from '../core/Scanner';

test('Positive debug(...) unit test', () => {
    const code = `
  public class Foo{

    private String bar = '';

}`;
    Scanner.debug('(variable_declarator (identifier)@foo) @bar', code).then((result: string) => {
        expect(result).toBe('["@bar=bar = \'\'","@foo=bar"]');
    });
});
