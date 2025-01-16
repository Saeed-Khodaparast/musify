import styles from "./List.module.css";

const List = ({ children }) => {
  return (
    <div>
      <ul className={styles.list}>{children}</ul>
    </div>
  );
};

export default List;
