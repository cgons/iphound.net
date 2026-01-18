import MatIcon from "./MatIcon";

export default function Logo() {
  return (
    <h1 className="mb-5 inline-block rounded-md bg-black px-4 py-1 text-[21px] font-black text-white italic">
      <MatIcon
        iconName="sound_detection_dog_barking"
        className="text-[23px]!"
      />
      <span>
        <span className="">ip</span>hound
      </span>

      {/*<span className="text-base">.net</span>*/}
    </h1>
  );
}
