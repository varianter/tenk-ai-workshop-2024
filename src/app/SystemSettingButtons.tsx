import styles from "./styles.module.css"

export default function SystemSettingButtons({
    systemOptions, 
    systemPrompt,
    setSystemPrompt
}:{
    systemOptions: {name: string, prompt: string} [], 
    systemPrompt: string,
    setSystemPrompt: (systemPrompt: string) => void;
    }){
    

      return (
        <div className={styles.systemSettingsButtonGroup}>
            {systemOptions.map((option) => (
              <button
                key={option.name}
                className = {`${styles.systemSettingsButton} ${
                    systemPrompt === option.prompt 
                    ? styles.systemSettingsButtonSelected : ""}`}
                onClick={() => setSystemPrompt(option.prompt)}
              >
                {option.name}
              </button>
            ))}
          </div>
      )
}