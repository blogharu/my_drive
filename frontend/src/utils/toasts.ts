import { Id, toast } from "react-toastify";

const Toasts = {
    createReloadFiles: () => { toast.success("Reloaded!", { position: toast.POSITION.BOTTOM_RIGHT }) },
    createUploadFile: (fileName: string) => toast.loading(`${fileName} 0%`, {
        closeButton: true, autoClose: 3000,
    }),
    updateUploadFile: (toastId: Id, fileName: string, percent: number) => {
        if (percent < 100) {
            toast.update(toastId, {
                render: `UPLOAD: ${fileName} ${percent}%`,
                position: toast.POSITION.BOTTOM_RIGHT,
            },)
        }
        else if (percent === 100) {
            toast.update(toastId, {
                render: `UPLOAD: ${fileName} saving...`,
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
        else {
            toast.update(toastId, {
                render: `UPLOAD: ${fileName} Success`,
                type: toast.TYPE.SUCCESS,
                autoClose: 3000,
                isLoading: false,
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
    }
}

export default Toasts 