type Props = {
  isOpen: boolean;
  children: JSX.Element;
};

export default function Modal(props: Props) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <div>
      <div className="absolute left-0 right-0 top-0 bottom-0 z-10 h-screen w-screen bg-black opacity-20" />
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-2/4 -translate-y-2/4 rounded-md bg-white p-2">
        {props.children}
      </div>
    </div>
  );
}
