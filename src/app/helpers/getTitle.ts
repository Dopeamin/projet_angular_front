import { environment } from "@/environments/environment";

export default function getTitle(title: string) {
    return environment.title + " | " + title;
}