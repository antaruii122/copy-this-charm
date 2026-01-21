import { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';

interface DriveFile {
    id: string;
    name: string;
    url: string;
    embedUrl: string;
    mimeType: string;
    sizeBytes?: number;
}

export const useGoogleDrivePicker = () => {
    const [openPicker] = useDrivePicker();
    const [isLoading, setIsLoading] = useState(false);

    const selectFromDrive = async (): Promise<DriveFile | null> => {
        setIsLoading(true);

        return new Promise((resolve) => {
            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
            const developerKey = import.meta.env.VITE_GOOGLE_API_KEY;
            const appId = import.meta.env.VITE_GOOGLE_APP_ID;

            if (!clientId || !developerKey || !appId) {
                console.error('Missing Google API credentials');
                setIsLoading(false);
                resolve(null);
                return;
            }

            openPicker({
                clientId,
                developerKey,
                appId,
                viewId: 'DOCS',
                showUploadView: true,
                showUploadFolders: true,
                supportDrives: true,
                multiselect: false,
                setIncludeFolders: true,
                setSelectFolderEnabled: false,
                customViews: [
                    {
                        viewId: 'DOCS',
                        mimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska', 'video/mpeg', 'video/x-flv'],
                    }
                ],
                locale: 'es',
                callbackFunction: (data) => {
                    setIsLoading(false);

                    if (data.action === 'picked' && data.docs && data.docs.length > 0) {
                        const file = data.docs[0];
                        resolve({
                            id: file.id,
                            name: file.name,
                            url: file.url,
                            embedUrl: `https://drive.google.com/file/d/${file.id}/preview`,
                            mimeType: file.mimeType,
                            sizeBytes: file.sizeBytes,
                        });
                    } else if (data.action === 'cancel') {
                        resolve(null);
                    }
                },
            });
        });
    };

    return { selectFromDrive, isLoading };
};
