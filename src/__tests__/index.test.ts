import createLSVCS, { IConfig } from '../index';

describe('index', () => {
  beforeEach(() => {
    localStorage.clear();
  })
  it('removes all keys if "removeAll" is true, and version is different', () => {
    const config = {version: '3', removeAll: true};
    localStorage.setItem('LOCAL_STORAGE_VERSION', '2')
    localStorage.setItem('foo', 'bar')
    createLSVCS(config);
    expect(localStorage.getItem('foo')).toBe(null);
  });


  it('does not remove all, if no version set', () => {
    const config = {version: '1', removeAll: true};
    localStorage.setItem('foo', 'bar')
    localStorage.setItem('foo', 'bar')
    createLSVCS(config);
    expect(localStorage.getItem('foo')).toBe('bar');
  })

  it('updates to new version if version differs', () => {
    const config = {version: '3'};
    localStorage.setItem('LOCAL_STORAGE_VERSION', '2')
    createLSVCS(config);
    expect(localStorage.getItem('LOCAL_STORAGE_VERSION')).toBe('3');
  });

  it('keeps all keys if "removeAll" is true, and version is same', () => {
    const config = {version: '3', removeAll: true};
    localStorage.setItem('LOCAL_STORAGE_VERSION', '3')
    localStorage.setItem('foo', 'bar')
    createLSVCS(config);
    expect(localStorage.getItem('foo')).toBe('bar');
  });

  it('removes keys specified in "remove", if version differs', () => {
    const config = {version: '3', remove: ['foo']};
    localStorage.setItem('LOCAL_STORAGE_VERSION', '2')
    localStorage.setItem('foo', 'bar')
    createLSVCS(config);
    expect(localStorage.getItem('foo')).toBe(null);
  });

  it('removes keys specified in "remove", if version differs', () => {
    const config = {version: '3', remove: ['foo']};
    localStorage.setItem('LOCAL_STORAGE_VERSION', '2')
    localStorage.setItem('bar', 'foo')
    createLSVCS(config);
    expect(localStorage.getItem('bar')).toBe('foo');
  });

  it('migrates a key in "migrations", if version differs', () => {
    const config: IConfig = {
      version: '3',
      migrations: [
        ['1', {foo: key => key + '-bar'}],
        ['2', {foo: key => key + '-rac'}],
        ['3', {foo: key => key + '-k'}],
      ]
    };
    localStorage.setItem('LOCAL_STORAGE_VERSION', '2')
    localStorage.setItem('foo', 'bam')
    createLSVCS(config);
    expect(localStorage.getItem('foo')).toBe('bam-k');
  });

  it('migrates a multiple keys in "migrations", if version differs', () => {
    const config: IConfig= {
      version: '2',
      migrations: [
        ['2', {foo: key => key + '-rack', bar: key => key + '-ma'}],
      ]
    };
    localStorage.setItem('LOCAL_STORAGE_VERSION', '1')
    localStorage.setItem('foo', 'bar');
    localStorage.setItem('bar', 'oba');
    createLSVCS(config);
    expect(localStorage.getItem('foo')).toBe('bar-rack');
    expect(localStorage.getItem('bar')).toBe('oba-ma');
  });
});
