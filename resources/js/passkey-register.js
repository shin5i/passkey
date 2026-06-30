// import { Passkeys } from "@laravel/passkeys";

// document.getElementById('register-passkey').addEventListener('click', async () => {
//     const response = await Passkeys.register();

//     if (response.redirect) {
//         window.location.href = response.redirect;
//     }
// });

import { Passkeys } from "@laravel/passkeys";

document.addEventListener('DOMContentLoaded', () => {
    // 画面内の「パスキー登録ボタン」を取得
    const registerButton = document.getElementById('register-passkey-btn');

    if (!registerButton) return;

    registerButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // ボタンを連打されないように無効化
        registerButton.disabled = true;
        registerButton.innerText = '認証中...';

        try {
            // パスキーの名前（デバイス名など）を任意で指定。空欄でもデバイス名が自動採用されます
            // const passkeyName = prompt("このパスキーの名前（例: 私のiPhone、会社のPC）を入力してください:", "") || "マイデバイス";
            
            // UserAgent を passkeyName に自動設定
            const ua = navigator.userAgent;

            // 例: "Chrome / Windows" のように整形
            const passkeyName = detectDeviceName(ua);

            // 🚀 公式ライブラリを呼び出してブラウザのパスキー（生体認証）ポップアップを起動
            // 内部で自動的に /user/passkeys へPOST送信まで完了します
            await Passkeys.register({
                name: passkeyName,
                routes: {
                    options: '/user/passkeys/options', // オプション取得URL
                    submit: '/user/passkeys'           // 登録実行URL
                }
            });

            alert('パスキーの登録が完了しました！');
            
            // 登録完了後に画面をリロードして、登録済みリストなどを更新
            window.location.reload();

        } catch (error) {
            console.error('パスキー登録エラー:', error);
 
                        // 💡 Laravel側から「パスワード確認が必要（423）」と言われた場合の処理
            if (error.message && error.message.includes('Password confirmation required')) {
                alert('セキュリティ保護のため、一度パスワードの再入力が必要です。確認画面へ移動します。');
                
                // Breeze標準のパスワード確認画面へリダイレクト
                // 認証成功後に自動でこの画面に戻ってこられるよう、現在のURL（イントロスペクション）を記憶させます
                window.location.href = `/confirm-password?redirect=${encodeURIComponent(window.location.pathname)}`;
                return;
            }


            // ユーザーが認証をキャンセルした場合のハンドリング
            if (error.name === 'NotAllowedError') {
                alert('パスキーの登録がキャンセルされました。');
            } else {
                alert('パスキーの登録に失敗しました。ブラウザや端末が対応しているか確認してください。');
            }
        } finally {
            // ボタンを元に戻す
            registerButton.disabled = false;
            registerButton.innerText = 'パスキーを登録する';
        }
    });
});

/**
 * UserAgent からブラウザ名 + OS名 を抽出する関数
 */
function detectDeviceName(ua) {
    let browser = "Unknown Browser";
    let os = "Unknown OS";

    // ブラウザ判定
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edg")) browser = "Edge";

    // OS 判定
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac OS")) os = "macOS";
    else if (ua.includes("iPhone")) os = "iPhone";
    else if (ua.includes("iPad")) os = "iPad";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("Linux")) os = "Linux";

    return `${browser} / ${os}`;
}