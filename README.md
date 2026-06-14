stemnova_hack

Монорепозиторий с двумя проектами: системой экологического контроля транспорта и отдельным прототипом панели управления для мониторинга очередей и устройств.

Структура

- 'eco_control/' — прототип экологического контроля транспорта.
- 'QubyrFlow/' — панель мониторинга очередей, устройств и AI-процессов.

Общие требования

- Node.js 18+;
- Python 3.10+;
- 'pnpm' для фронтендов;
- 'pip' для Python-частей.

Eco Control

Это веб-приложение для мониторинга выбросов транспорта с отдельным ML-скриптом обучения модели.

Запуск фронтенда

bash
cd eco_control/frontend
npm install
npm dev

Обучение модели

bash
cd eco_control/backend
python train.py


После обучения в папке 'eco_control/backend' появятся файл модели, список признаков и графики.

QubyrFlow

Это отдельный прототип дашборда с веб-интерфейсом, backend-частью на Python и аппаратными сценариями.

Запуск фронтенда

bash
cd QubyrFlow/frontend
npm install
npm dev

Запуск backend

bash
cd QubyrFlow/backend
uvicorn main:app --host 0.0.0.0


Если backend использует дополнительные зависимости, установите их из requirements.txt перед запуском.

Полезные файлы

- 'eco_control/backend/train.py' — обучение модели по датасету выбросов.
- 'eco_control/frontend/app/page.tsx' — точка входа интерфейса Eco Control.
- 'QubyrFlow/backend/main.py' — backend-логика проекта QubyrFlow.
- 'QubyrFlow/frontend/app/page.tsx' — точка входа интерфейса QubyrFlow.

Примечания

- В репозитории есть готовые артефакты обучения и mock-данные для демонстрации интерфейсов.
- Если нужен более подробный README для одного из проектов, лучше держать его внутри соответствующей папки, а в корне оставлять только обзор.