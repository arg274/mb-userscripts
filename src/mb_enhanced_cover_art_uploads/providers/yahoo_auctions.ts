import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assert, assertHasValue } from '@lib/util/assert';
import { parseDOM, qs, qsa, qsMaybe } from '@lib/util/dom';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

export class YahooAuctionsProvider extends CoverArtProvider {
    public readonly supportedDomains = ['page.auctions.yahoo.co.jp'];
    public readonly favicon = 'https://page.auctions.yahoo.co.jp/favicon.ico';
    public readonly name = 'Yahoo! Auctions Japan';

    protected readonly urlRegex = /\/jp\/auction\/([a-z0-9]+)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const itemId = this.extractId(url);
        assertHasValue(itemId);
        const itemUrl = `https://page.auctions.yahoo.co.jp/jp/auction/${itemId}`;
        const itemDoc = parseDOM(await this.fetchPage(new URL(itemUrl)), itemUrl);
        const images = qsa<HTMLImageElement>('.ProductImage__inner img', itemDoc);
        const imageUrls = images.map((img) => new URL(img.src));
        const types = [ArtworkTypeIDs.Raw];
        return imageUrls.map((url) => ({ url, types }));
    }
}