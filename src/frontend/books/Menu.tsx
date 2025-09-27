/**
 * @File   : Menu.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2022/9/16 23:12:38
 */
import * as React from 'react';
import { ButtonGroup, Button, Modal, Form, FormItem, Text, FormGroup, Sidebar, MenuItem, Icon } from 'hana-ui';

import bk from '../../backend';
import { ISystemSettings } from '../../interfaces';
import { selectBook, selectFolder } from '../utils';
import css from '../styles/books.module.scss';

interface IMenuProps {
  bookshelfListState: [string[], React.Dispatch<React.SetStateAction<string[]>>];
  selectedBookshelfState: [string, React.Dispatch<React.SetStateAction<string>>];
  settings: ISystemSettings;
  onUpdateSettings(settings: ISystemSettings): void;
  onAddBooks(files: string[]): void;
  onSync(): void;
}

export function Menu(props: IMenuProps) {
  const [settings, setSettings] = React.useState<ISystemSettings>();
  const [showConfig, setShowConfig] = React.useState<boolean>(false);
  const [showConfirm, setShowConfirm] = React.useState<boolean>(false);
  const [confirmText, setConfirmText] = React.useState<string[]>([]);
  const [showAbout, setShowAbout] = React.useState<boolean>(false);
  const [showBookshelf, setShowBookshelf] = React.useState<boolean>(false);
  const [showAddBookshelf, setShowAddBookshelf] = React.useState<boolean>(false);
  const [newBookshelfName, setNewBookshelfName] = React.useState<string>('');
  const [bookshelfList, setBookshelfList] = props.bookshelfListState;
  const [selectedBookshelf, setSelectedBookshelf] = props.selectedBookshelfState;
  const forceUpdate: () => void = React.useState({})[1].bind(null, {})

  return (
    <>
      <ButtonGroup className={css.menu}>
        <Button
          className={css.menuItem}
          icon={'flower'}
          onClick={() => {
            setSettings({
              folder: props.settings.folder,
              webDav: Object.assign({}, props.settings.webDav),
              read: Object.assign({}, props.settings.read)
            });
            setShowConfig(true);
          }}
        >
          设定
        </Button>
        <Button
          className={css.menuItem}
          icon={'reuse'}
          iconStyle={{ fontSize: '0.9rem' }}
          onClick={props.onSync}
        >
          同步
        </Button>
        {
          bk.supportAddDeleteBook && (
            <Button
              className={css.menuItem}
              icon={'plus'}
              onClick={() => {
                selectBook().then(files => {
                  files.length && props.onAddBooks(files)
                })
              }}
            >
              添加
            </Button>
          )
        }
        <Button
          className={css.menuItem}
          icon={'clover'}
          onClick={() => setShowAbout(true)}
        >
          关于
        </Button>
        <Button
          className={css.menuItem}
          icon={'menu'}
          onClick={() => setShowBookshelf(n => !n)}
        >
          书架
        </Button>
      </ButtonGroup>

      <Modal
        title={'设定'}
        show={showConfig}
        closeOnClickBg={false}
        confirm={() => {
          const text: string[] = [];

          if (
            props.settings.webDav.url !== settings.webDav.url ||
            props.settings.webDav.user !== settings.webDav.user
          ) {
            text.push('WebDAV账号更新，重新同步远端书籍。');
          }

          if (props.settings.folder !== settings.folder) {
            text.push('本地路径更新，移动本地文件。');
          }

          if (!text.length) {
            props.onUpdateSettings(settings);
            setShowConfig(false);
          } else {
            setConfirmText(text);
            setShowConfirm(true);
          }
        }}
        cancel={() => setShowConfig(false)}
        style={{ with: '60%' }}
      >
        {
          settings && (
            <Form labelPosition='top'>
              {
                bk.supportChangeFolder && (
                  <FormGroup label="存储目录">
                    <FormItem status='normal'>
                      <Text value={settings.folder} disabled />
                    </FormItem>

                    <FormItem>
                      <Button
                        onClick={() => {
                          selectFolder(false).then(folder => {
                            if (folder) {
                              settings.folder = folder;
                              forceUpdate();
                            }
                          })
                        }}
                      >
                        选择
                      </Button>
                    </FormItem>
                  </FormGroup>
                )
              }

              <FormGroup label="WebDAV" elementStyle={{ flexFlow: 'column' }}>
                <FormItem label="地址" status='normal'>
                  <Text
                    defaultValue={settings.webDav.url}
                    auto
                    onChange={e => {
                      settings.webDav.url = (e.target as any).value;
                    }}
                  />
                </FormItem>

                <FormItem label="用户名" status='normal'>
                  <Text
                    defaultValue={settings.webDav.user}
                    auto
                    onChange={e => {
                      settings.webDav.user = (e.target as any).value;
                    }}
                  />
                </FormItem>

                <FormItem label="密码" status='normal'>
                  <Text
                    defaultValue={settings.webDav.password}
                    auto
                    onChange={e => {
                      settings.webDav.password = (e.target as any).value;
                    }}
                    mode='password'
                  />
                </FormItem>
              </FormGroup>
            </Form>
          )
        }
      </Modal>

      <Modal
        show={showConfirm}
        closeOnClickBg={false}
        title='请确认重要信息更新'
        confirm={() => {
          props.onUpdateSettings(settings);
          setShowConfig(false);
          setShowConfirm(false);
        }}
        cancel={() => setShowConfirm(false)}
        titleStyle={{ color: 'red' }}
        contentStyle={{ color: 'red' }}
      >
        {
          confirmText.map(t => (
            <p key={t}>{t}</p>
          ))
        }
      </Modal>

      <Modal
        show={showAbout}
        confirm={() => setShowAbout(false)}
        showClose={false}
      >
        <div className={css.about}>
          <img
            className={css.aboutLogo}
            src={require('../assets/logo.png')}
          />
          <div className={css.aboutSlogan}>
            <p>作为演员的时候，</p>
            <p>我们不可忘却愤怒。</p>
            <p>作为观众的时候，</p>
            <p>我们不可忘却叹息。</p>
          </div>
          <p className={css.aboutLinks}>
            <a href="https://github.com/dtysky/Awaken" target='_blank'>项目主页</a>
            <a href="https://github.com/dtysky/Awaken/blob/master/CHANGELOG.md" target='_blank'>检查更新</a>
          </p>

          <div className={css.aboutCopyright}>
            <p>Copyright © 2022</p>
            <p>戴天宇, Tianyu Dai (dtysky@outlook.com) 拥有所有权利</p>
            <p>本软件为自由软件，遵循协议</p>
            <a href="https://www.gnu.org/licenses/lgpl-3.0.html" target='_blank'>GNU Lesser General Public License (LGPL)</a>
          </div>
        </div>
      </Modal>
      <Sidebar
        open={showBookshelf}
        style={{ width: '300px' }}
      >
        <button
          className={`${css.bookshelfButton} ${selectedBookshelf ? '' : css.bookshelfButtonActive}`}
          onClick={() => setSelectedBookshelf(null)}
        >默认书架</button>
        {bookshelfList.map(bookshelfName => (
          <button
            className={`${css.bookshelfButton} ${selectedBookshelf === bookshelfName ? css.bookshelfButtonActive : ''}`}
            key={bookshelfName}
            onClick={() => setSelectedBookshelf(bookshelfName)}
          >{bookshelfName}</button>
        ))}
        <button
          className={css.bookshelfButton}
          style={{ borderBottom: 'none' }}
          onClick={() => {
            setShowAddBookshelf(true);
          }}
        >
          <Icon type='plus' style={{ marginRight: '0.5rem' }} />
          添加书架
        </button>
      </Sidebar>
      <Modal
        show={showAddBookshelf}
        confirm={() => {
          if (newBookshelfName.trim().length) {
            if (bookshelfList.indexOf(newBookshelfName) >= 0 || newBookshelfName === '默认书架') {
              alert('书架已存在！');
              return;
            }
            setBookshelfList([...bookshelfList, newBookshelfName]);
            setNewBookshelfName('');
            setShowAddBookshelf(false);
          }
        }}
        cancel={() => {
          setShowAddBookshelf(false);
          setNewBookshelfName('');
        }}
      >
        <div>
          <h3>添加书架</h3>
          <hr />
          <p>请输入书架名称</p>
          <Text
            value={newBookshelfName}
            onChange={(e, _) => setNewBookshelfName((e.target as any).value)}
          />
        </div>
      </Modal>
    </>
  )
}
