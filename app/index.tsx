import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from "react-native";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoItem from "../components/TodoItem";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "@todos";

export default function HomeScreen() {

  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos])

  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setTodos(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log("Gagal load todos", e);
    }
  };

  const saveTodos = async (data: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log("Gagal save todos", e);
    }
  };

  const addTodo = () => {
    if (text.trim() === "") return;

    setTodos([...todos, {
      id: Date.now(),
      text,
      completed: false
    },
    ]);
    setText("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  const hasCompleted = todos.some(todo => todo.completed);

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const startEdit = (todo: { id: number; text: string }) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = () => {
    if (editingText.trim() === "") return;

    setTodos(
      todos.map(todo =>
        todo.id === editingId
          ? { ...todo, text: editingText }
          : todo
      )
    );

    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  return (
    <View style={styles.screen}>
      <Header title="My Todo List" />

      {editingId && (
        <View style={styles.editContainer}>
          <TextInput
            value={editingText}
            onChangeText={setEditingText}
            style={styles.input}
            autoFocus
          />

          <View style={styles.editActions}>
            <TouchableOpacity
              onPress={saveEdit}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={cancelEdit}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Tulis todo..."
            style={styles.input}
            value={text}
            onChangeText={setText}
          />

          <TouchableOpacity style={styles.button} onPress={addTodo}>
            <Text style={styles.buttonText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {itemsLeft} items left
          </Text>
        </View>

        <View style={styles.filterContainer}>
          {["all", "active", "completed"].map((item) =>
            <TouchableOpacity
              key={item}
              style={[
                styles.filterButton,
                filter === item && styles.activeFilter,
              ]}
              onPress={() => setFilter(item as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.activeFilterText,
                ]}
              >
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {hasCompleted && (
          <TouchableOpacity
            onPress={clearCompleted}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>
              Clear Completed
            </Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={startEdit}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 8,
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#E5E5EA",
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#4CAF50",
  },
  filterText: {
    fontWeight: "bold",
    color: "#555",
  },
  activeFilterText: {
    color: "#fff",
  },
  editContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    height: 140,
    borderRadius: 12,
    marginBottom: 15,
    marginTop: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 4,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
  },
  cancelText: {
    color: "#FF3B30",
    marginTop: 10,
    marginLeft: 15,
    fontWeight: "500",
  },
  counterContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  counterText: {
    color: "#2E7D32",
    fontWeight: "600",
    fontSize: 13,
  },
  clearButton: {
    marginTop: 15,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
  },
  clearButtonText: {
    color: "#B91C1C",
    fontWeight: "600",
    fontSize: 14,
  },

  saveButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  cancelButtonText: {
    marginLeft: 16,
    color: "red",
    fontSize: 14,
  },

});

