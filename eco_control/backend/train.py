import pandas as pd
import matplotlib
matplotlib.use('Agg') # Фоновый рендер, чтобы избежать ошибки tkinter
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, ConfusionMatrixDisplay
import joblib

print("1. Загрузка датасета...")
try:
    df = pd.read_csv('vehicle_emission_dataset.csv') 
    print("Успешно загружено!")
except FileNotFoundError:
    print("ОШИБКА: Файл CSV не найден.")
    exit()

df = df.dropna()

print("\n2. Подготовка данных...")
target_column = 'Emission_Level' 

y = df[target_column]
X = df.drop(columns=[target_column])
X = pd.get_dummies(X)
train_features = list(X.columns)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\n3. Обучение модели Random Forest...")
model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train, y_train)

print("\n4. Оценка точности...")
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Общая точность модели: {accuracy * 100:.2f}%\n")
print(classification_report(y_test, y_pred))

print("\n5. Построение графиков...")
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=model.classes_)
disp.plot(ax=axes[0], cmap='Blues', colorbar=False)
axes[0].set_title('Матрица ошибок')
importances = model.feature_importances_
feat_importances = pd.Series(importances, index=train_features).sort_values(ascending=True)

feat_importances.tail(10).plot(kind='barh', ax=axes[1], color='teal')
axes[1].set_title('Важность параметров (Топ-10)')
axes[1].set_xlabel('Вес (влияние на результат)')

plt.tight_layout()
plt.savefig('ml_graphs.png') 
print("Графики успешно сохранены в файл 'ml_graphs.png'. Открой папку, чтобы посмотреть.")
print("\n5. Построение графиков...")
fig, axes = plt.subplots(2, 2, figsize=(16, 12))

y.value_counts().plot(kind='bar', ax=axes[0, 0], color=['#4C72B0', '#DD8452', '#55A868', '#C44E52'])
axes[0, 0].set_title('Распределение классов в исходном датасете', fontsize=14)
axes[0, 0].set_ylabel('Количество машин')
axes[0, 0].tick_params(axis='x', rotation=0)

cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=model.classes_)
disp.plot(ax=axes[0, 1], cmap='Blues', colorbar=False)
axes[0, 1].set_title('Матрица ошибок ИИ (на тестовой выборке)', fontsize=14)

importances = model.feature_importances_
feat_importances = pd.Series(importances, index=train_features).sort_values(ascending=True)
feat_importances.tail(10).plot(kind='barh', ax=axes[1, 0], color='teal')
axes[1, 0].set_title('Важность параметров (На что смотрит ИИ?)', fontsize=14)
axes[1, 0].set_xlabel('Вес (влияние на результат)')

comparison_df = pd.DataFrame({
    'Реально было': y_test.value_counts(), 
    'ИИ предсказал': pd.Series(y_pred).value_counts()
}).fillna(0) 

comparison_df.plot(kind='bar', ax=axes[1, 1], color=['#55A868', '#C44E52'])
axes[1, 1].set_title('Реальность vs Предсказания модели', fontsize=14)
axes[1, 1].set_ylabel('Количество машин')
axes[1, 1].tick_params(axis='x', rotation=0)
axes[1, 1].legend()
plt.tight_layout()
plt.savefig('ml_graphs.png', dpi=300) 
print("Все 4 графика успешно сгенерированы и сохранены в файл 'ml_graphs.png'!")

print("\n6. Сохранение модели и списка фичей...")
joblib.dump(model, "vehicle_emission_model.pkl")
joblib.dump(train_features, "vehicle_train_features.pkl")
print("Готово! Модель сохранена.")
print("\n6. Сохранение модели и списка фичей...")
joblib.dump(model, "vehicle_emission_model.pkl")
joblib.dump(train_features, "vehicle_train_features.pkl")
print("Готово! Модель сохранена.")