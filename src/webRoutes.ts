import { Router } from 'express';
import { postFindCards } from './controllers/web/cards/SearchCardController';
import { getConnectivityCheck, postConnectivityCheck } from './controllers/web/debug/ConnectivityCheckController';

// ルート設定
export function configRoutes(router: Router) {
    // 接続確認（GET）
    router.get('/connectivity', getConnectivityCheck)
    // 接続確認（POST）
    router.post('/connectivity', postConnectivityCheck)
    // カード検索（GET）
    router.post('/search_cards', postFindCards)
}