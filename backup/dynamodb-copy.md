# dynamodb-copy

## install

```bash
pip3 install boto
```

## backup

```bash
python3 dynamodb-copy.py deepracer-board-leagues-dev deepracer-board-leagues-backup

python3 dynamodb-copy.py deepracer-board-racers-dev deepracer-board-racers-backup
```

## restore

```bash
python3 dynamodb-copy.py deepracer-board-leagues-backup deepracer-board-leagues-dev

python3 dynamodb-copy.py deepracer-board-racers-backup deepracer-board-racers-dev
```
