import {atom} from 'recoil';

export const adsListAtom = atom({
    key: 'adsListAtom',
    default: undefined,
});

export const selectedAdsListAtom = atom({
    key: 'selectedAdsListAtom',
    default: undefined,
});

export const selectedDeleteAdsListAtom = atom({
    key: 'selectedDeleteAdsListAtom',
    default: undefined,
});

export const filteredDataAtom = atom({
    key: 'filteredDataAtom',
    default: undefined,
});

export const selectedCategoryAtom = atom({
    key: 'selectedCategoryAtom',
    default: [],
})

export const adsListMapAtom = atom({
    key: 'adsListMapAtom',
    default: undefined,
})

export const searchListMapAtom = atom({
    key: 'searchListMapAtom',
    default: undefined,
})

export const mappingRefreshCountAtom = atom({
    key: 'mappingRefreshCountAtom',
    default: 0,
})

export const addCategoryRefreshCountAtom = atom({
    key: 'addCategoryRefreshCountAtom',
    default: 0,
})

