interface GenerateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GenerateModal({ isOpen, onClose } : GenerateModalProps) {
    if (!isOpen) return null;

    return (
        <div className="w-screen h-screen fixed top-0 left-0 bg-black/50">

        </div>
    )
}