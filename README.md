# stjj-aic-server

# 開発の準備
Node.jsをインストールする（Webアプリとフロントエンドの開発に使うため）  
aurelia cliをインストールする（フロントエンドの開発に使うため。npm install aurelia-cli -gを実行することで入れられる）  
VirtualBoxをインストールする（本番環境を模した環境のVMでWebアプリやFANDOMカード同期Pythonを実行するため）  
Vagrantをインストールする（同上）  
vagrant-vbguestをインストールする（先述のVM内に開発したソースコードを共有するため。vagrant plugin install vagrant-vbguestを実行することで入れられる）  
何か適当なフォルダで以下を実行する  
mkdir repo  
cd repo  
git clone git@github.com:scp-tcg-jp-j/stjj-aic-server.git  
cd stjj-aic-server  
git fetch origin 【ブランチ名】  
git checkout 【ブランチ名】  
※上記のブランチ名は開発対象で適宜決める。カード検索機能はcard-searchブランチで実装中  
cd ..  
git clone git@github.com:scp-tcg-jp-j/scp-tcg-jp-j.github.io.git stjj-aic-front  
cd stjj-aic-front  
git fetch origin 【ブランチ名】  
git checkout 【ブランチ名】  
※上記のブランチ名は開発対象で適宜決める。カード検索機能はcard-searchブランチで実装中  
npm install  
cd ..  
git clone git@github.com:scp-tcg-jp-j/stjj-aic-vm vagrant  
cd vagrant  
vagrant up  
vagrant ssh  
※最後まで成功するとSTJJ.AICをローカル環境で実行するためのVMにログインしているはず  
# ローカル環境でのWebアプリケーションのビルド
先述のVM内で以下を実行する  
cp -r /home/vagrant/repo/stjj-aic-server/src /var/www/stjj-aic-server  
cp /home/vagrant/repo/stjj-aic-server/package.json /var/www/stjj-aic-server/package.json  
cp /home/vagrant/repo/stjj-aic-server/tsconfig.json /var/www/stjj-aic-server/tsconfig.json  
cd /var/www/stjj-aic-server  
npm install  
npx -p typescript tsc  
# ローカル環境でのWebアプリケーションの実行
先述のビルドを実行したうえで、先述のVM内で以下を実行する  
nohup sudo -b -u stjj-aic /opt/.nvm/versions/node/v14.15.5/bin/node /var/www/stjj-aic-server/serve/src/index.js --env=local &  
# ローカル環境でのフロントエンドの実行
VM「外」のstjj-aic-frontフォルダで以下を実行する  
au run  
※https://localhost:8080にアクセスすると見られる  
# ローカル環境でのFANDOMカード同期Pythonの実行
todo: 詳細未定  
おそらく/home/vagrant/repo/stjj-aic-server/pythonを/var/www/stjj-aic-server/pythonにコピーして何かする？  
# ローカル環境でのWebアプリケーションの停止
VM内で以下を実行する  
ps aux | grep node  
上記で得たnodeのPIDを以下で殺す（※sudoがついてない方のPID）  
sudo kill -9 【PID】  
# ローカル環境でのフロントエンドの実行停止
CTRL+Cで強制停止  

# URL台帳（Webアプリ）
ローカル環境の場合は https://localhost の後ろに以下を付ける  
本番環境の場合は https://api.scptcgjpj.tk の後ろに以下を付ける  
* /connectivity
  * 接続確認用
  * GET: リクエストパラメータをオウム返しする（はず）
  * POST: リクエストボディをオウム返しする（はず）

# URL台帳（FANDOMカード同期）
ローカルでも本番でも http://localhost:55000 の後ろに以下を付ける（サーバー内で通信が完結するため）  
* /upsert
  * カード追加・カード更新用（1枚）
  * POST: 例のフォーマット（のはず）
* /bulk_delete
  * カード削除用（現在FANDOMに存在するカードのpageidをもとに削除を実行）
  * POST: 例のフォーマット（のはず）

# todo
* とりあえずカード取り込みを動かしてみて確認
* 実行オプションをちゃんと考える（--env=localと--env=prodは適当に入れた。nodeのargvの扱いがよく分かってないから調べること）
* ログをどうするか考える（ファイルでログローテのつもり）
* NeDBはトランザクション張れないのでせめて復旧できるようにログを出す。
* 排他制御。mutexか何か持たせればいいか？
* コメント少ないから書くこと