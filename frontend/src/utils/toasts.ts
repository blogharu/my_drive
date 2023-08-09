import { Id, toast } from "react-toastify";

const Toasts = {
    createReloadFiles: () => { toast.success("Reloaded!", { position: toast.POSITION.BOTTOM_RIGHT }) },
    createUploadFile: (fileName: string) => toast.loading(`${fileName} 0%`, {
        closeButton: true, autoClose: 3000, position: toast.POSITION.BOTTOM_RIGHT
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
        else if (percent === 200) {
            toast.update(toastId, {
                render: `UPLOAD: ${fileName} Success`,
                type: toast.TYPE.SUCCESS,
                autoClose: 3000,
                isLoading: false,
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
    },
    errorResponse: (error) => {
        let data = error.response.data
        if ('detail' in data) {
            toast.error(data.detail, { position: toast.POSITION.BOTTOM_RIGHT })
        }
        else if ('text' in data) {
            data.text().then((data) => toast.error(JSON.parse(data).detail, { position: toast.POSITION.BOTTOM_RIGHT }))
        }
    },
    warning: (msg) => {
        toast.warning(msg, { position: toast.POSITION.BOTTOM_RIGHT })
    },
    dismiss: (toastId) => {
        toast.dismiss(toastId)
    }
}

export default Toasts 