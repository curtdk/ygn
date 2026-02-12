import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Table, Input, Select, Label } from "@medusajs/ui"
import { useState, useEffect } from "react"

const VideoMaterialsWidget = ({ data }: { data: any }) => {
  const [materials, setMaterials] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    material_key: "",
    material_type: "image",
    default_url: "",
    is_replaceable: true,
    sort_order: 0
  })
  const [uploadingFile, setUploadingFile] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const productId = data?.id

  useEffect(() => {
    if (productId) {
      fetchMaterials()
    }
  }, [productId])

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`/admin/video-materials?product_id=${productId}`, {
        credentials: "include"
      })
      const data = await response.json()
      setMaterials(data.materials || [])
    } catch (error) {
      console.error("Failed to fetch materials:", error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingFile(true)
      const formData = new FormData()
      formData.append("files", file)

      const response = await fetch("/admin/uploads", {
        method: "POST",
        credentials: "include",
        body: formData
      })

      if (!response.ok) {
        throw new Error("上传失败")
      }

      const result = await response.json()
      console.log("上传结果:", result)

      // Medusa上传API返回格式: { files: [{ url, key, ... }] }
      if (result.files && result.files.length > 0) {
        const uploadedUrl = result.files[0].url
        setNewMaterial({
          ...newMaterial,
          default_url: uploadedUrl
        })
        // 如果是图片，设置预览
        if (file.type.startsWith('image/')) {
          setPreviewImage(uploadedUrl)
        }
      } else {
        alert("上传成功但无法获取文件URL")
      }
    } catch (error) {
      console.error("上传失败:", error)
      alert("文件上传失败")
    } finally {
      setUploadingFile(false)
    }
  }

  const handleAddMaterial = async () => {
    try {
      // 自动生成 material_key（基于名称的拼音或简单转换）
      const materialKey = newMaterial.name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w_]/g, '') || `material_${Date.now()}`

      const dataToSend = {
        ...newMaterial,
        material_key: materialKey,
        product_id: productId
      }

      console.log("准备保存的数据:", dataToSend)

      const response = await fetch("/admin/video-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataToSend)
      })

      const result = await response.json()
      console.log("保存结果:", result)

      setIsAdding(false)
      setNewMaterial({
        name: "",
        material_key: "",
        material_type: "image",
        default_url: "",
        is_replaceable: true,
        sort_order: 0
      })
      setPreviewImage(null)
      fetchMaterials()
    } catch (error) {
      console.error("保存失败:", error)
      alert("保存失败，请查看控制台")
    }
  }

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm("确定要删除这个素材吗？")) return

    try {
      await fetch(`/admin/video-materials/${materialId}`, {
        method: "DELETE",
        credentials: "include"
      })
      fetchMaterials()
    } catch (error) {
      console.error("Failed to delete material:", error)
    }
  }

  const materialTypeLabels: Record<string, string> = {
    image: "图片",
    audio: "声音",
    background: "背景",
    video: "视频"
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-4">
        <Heading level="h2">视频可替换素材</Heading>
        <Button onClick={() => setIsAdding(true)}>添加素材</Button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 border rounded">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="mb-2">素材名称</Label>
              <Input
                placeholder="例如：角色1、背景音乐"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2">素材类型</Label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newMaterial.material_type}
                onChange={(e) => setNewMaterial({ ...newMaterial, material_type: e.target.value })}
              >
                <option value="image">图片</option>
                <option value="audio">声音</option>
                <option value="background">背景</option>
                <option value="video">视频</option>
              </select>
            </div>

            <div className="col-span-2">
              <Label className="mb-2">默认素材</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*,audio/*,video/*"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                />
              </div>
              {previewImage && (
                <div className="mt-3">
                  <img
                    src={previewImage}
                    alt="预览"
                    className="max-w-xs h-32 object-cover rounded border"
                  />
                </div>
              )}
              {newMaterial.default_url && !previewImage && (
                <div className="mt-2 text-sm text-gray-600 truncate">
                  已上传: {newMaterial.default_url}
                </div>
              )}
            </div>

            <div>
              <Label className="mb-2">是否可替换</Label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newMaterial.is_replaceable ? "true" : "false"}
                onChange={(e) => setNewMaterial({ ...newMaterial, is_replaceable: e.target.value === "true" })}
              >
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
            </div>

            <div>
              <Label className="mb-2">排序顺序</Label>
              <Input
                type="number"
                placeholder="0"
                value={newMaterial.sort_order}
                onChange={(e) => setNewMaterial({ ...newMaterial, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddMaterial} disabled={!newMaterial.name || uploadingFile}>
              {uploadingFile ? "上传中..." : "保存"}
            </Button>
            <Button variant="secondary" onClick={() => {
              setIsAdding(false)
              setPreviewImage(null)
            }}>取消</Button>
          </div>
        </div>
      )}

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>名称</Table.HeaderCell>
            <Table.HeaderCell>类型</Table.HeaderCell>
            <Table.HeaderCell>默认素材</Table.HeaderCell>
            <Table.HeaderCell>可替换</Table.HeaderCell>
            <Table.HeaderCell>排序</Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {materials.map((material: any) => (
            <Table.Row key={material.id}>
              <Table.Cell>{material.name}</Table.Cell>
              <Table.Cell>{materialTypeLabels[material.material_type] || material.material_type}</Table.Cell>
              <Table.Cell>
                {material.default_url ? (
                  material.material_type === 'image' ? (
                    <a
                      href={material.default_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={material.default_url}
                        alt={material.name}
                        className="h-16 w-16 object-cover rounded border hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    </a>
                  ) : (
                    <a href={material.default_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      查看素材
                    </a>
                  )
                ) : (
                  "未设置"
                )}
              </Table.Cell>
              <Table.Cell>{material.is_replaceable ? "是" : "否"}</Table.Cell>
              <Table.Cell>{material.sort_order}</Table.Cell>
              <Table.Cell>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleDeleteMaterial(material.id)}
                >
                  删除
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {materials.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          暂无素材，点击"添加素材"开始配置
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default VideoMaterialsWidget
