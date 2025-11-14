from context import llm
def main():
    reply = llm.invoke("Reply with a short greeting.")
    print(reply)


if __name__ == "__main__":
    main()
