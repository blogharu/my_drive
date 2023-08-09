from pathlib import Path


def get_files(dir_path: Path, is_dot_files=False) -> list[dict]:
    files = []
    pattern = "*" if is_dot_files else "[!.]*"
    for file in dir_path.glob(pattern):
        if file.is_dir():
            file_type = "d"
        elif file.is_file():
            file_type = "-"
        else:
            continue
        stat = file.stat()
        files.append(
            dict(
                name=file.name,
                size=stat.st_size,
                type=file_type,
            )
        )
    return files
