import { MMKV } from 'react-native-mmkv'
import { content } from '../../constants/content'


export const mmkv = new MMKV({
    id: 'secure-storage',
    encryptionKey:content.secret


})

export const reduxStorage = {
    setItem: (key, value) => {
        mmkv.set(key, value)
        return Promise.resolve(true)
    },
    getItem: (key) => {
        const value = mmkv.getString(key)
        return Promise.resolve(value ?? null)
    },
    removeItem: (key) => {
        mmkv.delete(key)
        return Promise.resolve()
    },
}
