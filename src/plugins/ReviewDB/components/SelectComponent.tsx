import { getSetting, setSetting } from "../Utils/Utils";
import { FormTitle, Select } from "../Utils/Modules";

const React = BdApi.React as typeof import("react");
// thank https://github.com/Vendicated/Vencord for this
export default function SelectComponent({text , setting, defaultValue = true} : {text : string, setting : string, defaultValue? : boolean}) {
    const [state, setState] = React.useState<any>(getSetting(setting, defaultValue));

    function handleChange(value) {
        setState(value);
        setSetting(setting,value);
    }
  return ( <>

  <FormTitle style = {
    {
        marginTop: 4,
        marginBottom: 4,
    }
  }>{text}</FormTitle>

  <Select options={[
        { label: "Enabled", value: true },
        { label: "Disabled", value: false },
    ]} placeholder = { state ? "Enabled" : "Disabled"}
    maxVisibleItems = {3}
    closeOnSelect={true}
    isSelected={v => v === state}
    serialize={v => String(v)}
    select = {handleChange}
    />
  </>
  )
}
