import { Passkeys } from "@laravel/passkeys";

document.addEventListener('DOMContentLoaded', () => {
    // ログイン画面の「パスキーでログイン」ボタンを取得
    const loginButton = document.getElementById('passkey-login-btn');

    if (!loginButton) return;

    loginButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        loginButton.disabled = true;
        loginButton.innerText = '認証中...';

        try {
            // 🚀 公式ライブラリを呼び出してブラウザの認証ポップアップを起動
            // 内部で自動的に /passkeys/login/options の取得から /passkeys/login へのPOST送信まで完了します
            await Passkeys.verify();

            // ログイン成功したらダッシュボードへリダイレクト
            window.location.href = '/dashboard';

        } catch (error) {
            console.error('パスキーログインエラー:', error);
            
            if (error.name === 'NotAllowedError') {
                alert('ログイン認証がキャンセルされました。');
            } else {
                alert('パスキーによるログインに失敗しました。登録されたデバイスか確認してください。');
            }
        } finally {
            loginButton.disabled = false;
            loginButton.innerText = 'パスキーでログイン';
        }
    });
});
