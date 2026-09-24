type InfoMessageProps = {
  message: string;
};
const InfoMessage = ({ message }: InfoMessageProps) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
      <div className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-700">
        {message}
      </div>
    </div>
  );
};

export default InfoMessage;
